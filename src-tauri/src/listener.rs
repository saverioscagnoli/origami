use std::collections::HashMap;

use global_hotkey::{
    hotkey::{Code, HotKey, Modifiers},
    GlobalHotKeyEvent, GlobalHotKeyEventReceiver, GlobalHotKeyManager, HotKeyState,
};
use winit::{
    event_loop::{ControlFlow, EventLoop, EventLoopBuilder},
    platform::windows::EventLoopBuilderExtWindows,
};

use crate::backend::Backend;

pub struct HotkeyListener<'a> {
    backend: Backend<'a>,
    hotkey_manager: GlobalHotKeyManager,
    hotkey_receiver: &'a GlobalHotKeyEventReceiver,
    event_loop: EventLoop<()>,
    hotkeys: HashMap<u32, String>,
}

impl<'a> HotkeyListener<'a> {
    pub fn new(app: &'a tauri::AppHandle) -> Self {
        let hotkey_manager = GlobalHotKeyManager::new().unwrap();
        let hotkey_receiver = GlobalHotKeyEvent::receiver();

        let event_loop = EventLoopBuilder::new()
            .with_any_thread(true)
            .build()
            .unwrap();

        let mut listener = HotkeyListener {
            backend: Backend::new(app),
            hotkey_manager,
            hotkey_receiver,
            event_loop,
            hotkeys: HashMap::new(),
        };

        let switcher_hotkey = HotKey::new(Some(Modifiers::ALT), Code::KeyP);

        listener.register_hotkey("window-switcher", switcher_hotkey);

        listener
    }

    fn register_hotkey(&mut self, name: &str, hotkey: HotKey) {
        self.hotkey_manager.register(hotkey).unwrap();
        self.hotkeys.insert(hotkey.id(), name.to_string());
    }

    pub fn start_listening(self) {
        self.event_loop
            .run(move |_, target| {
                target.set_control_flow(ControlFlow::Wait);

                if let Ok(event) = self.hotkey_receiver.try_recv() {
                    if event.state() == HotKeyState::Pressed {
                        if let Some(name) = self.hotkeys.get(&event.id()) {
                            match name.as_str() {
                                "window-switcher" => self.backend.switcher_callback(),
                                _ => (),
                            }
                        }
                    }
                }
            })
            .unwrap();
    }
}
