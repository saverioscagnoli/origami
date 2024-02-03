use std::{collections::HashMap, sync::mpsc::Sender};

use global_hotkey::{
    hotkey::{Code, HotKey, Modifiers},
    GlobalHotKeyEvent, GlobalHotKeyEventReceiver, GlobalHotKeyManager, HotKeyState,
};
use winit::{
    event_loop::{ControlFlow, EventLoop, EventLoopBuilder},
    platform::windows::EventLoopBuilderExtWindows,
};

use crate::libs::enums::HotKeyName;

pub struct Listener<'a> {
    sender: Sender<HotKeyName>,
    hotkey_manager: GlobalHotKeyManager,
    hotkey_channel: &'a GlobalHotKeyEventReceiver,
    hotkey_map: HashMap<u32, HotKeyName>,
    event_loop: EventLoop<()>,
}

impl<'a> Listener<'a> {
    pub fn new(sender: Sender<HotKeyName>) -> Self {
        let hotkey_manager = GlobalHotKeyManager::new().unwrap();
        let hotkey_channel = GlobalHotKeyEvent::receiver();
        let hotkey_map = HashMap::new();
        let event_loop = EventLoopBuilder::new()
            .with_any_thread(true)
            .build()
            .unwrap();

        let mut listener = Self {
            sender,
            hotkey_manager,
            hotkey_channel,
            hotkey_map,
            event_loop,
        };

        listener.init_hotkeys();

        listener
    }

    fn init_hotkeys(&mut self) {
        let switcher_hotkey = HotKey::new(Some(Modifiers::ALT), Code::KeyP);
        let calculator_hotkey = HotKey::new(Some(Modifiers::ALT), Code::KeyC);

        self.register_hotkey(HotKeyName::WindowSwitcher, switcher_hotkey);
        self.register_hotkey(HotKeyName::Calculator, calculator_hotkey);
    }

    fn register_hotkey(&mut self, name: HotKeyName, hotkey: HotKey) {
        self.hotkey_manager.register(hotkey).unwrap();
        self.hotkey_map.insert(hotkey.id(), name);
    }

    pub fn start_loop(self) {
        self.event_loop
            .run(|_, target| {
                target.set_control_flow(ControlFlow::Wait);

                if let Ok(event) = self.hotkey_channel.try_recv() {
                    if event.state() == HotKeyState::Pressed {
                        let name = self.hotkey_map.get(&event.id()).unwrap();

                        self.sender.send(*name).unwrap();
                    }
                }
            })
            .unwrap();
    }
}
