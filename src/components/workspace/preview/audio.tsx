import { Progress, Slider, Spinner } from "@components/tredici";
import { THROTTLE_RATE_AUDIO_VISUALIZER } from "@lib/consts";
import { cn, convertSrcBase64 } from "@lib/utils";
import { Cross1Icon, PauseIcon, PlayIcon, ReloadIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/core";
import { CommandName } from "@typings/enums";
import { PreviewProps } from "@typings/props";
import { FC, useEffect, useRef, useState } from "react";

type AudioState = "playing" | "paused" | "over";

const AudioPreview: FC<PreviewProps> = ({ path, ext }) => {
  const [src, setSrc] = useState<string>("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [audioState, setAudioState] = useState<AudioState>("paused");

  /**
   * Total duration
   * Seconds elapsed
   */
  const [duration, setDuration] = useState<number>(0);
  const [sec, setSec] = useState<number>(0);

  /**
   * Track the progress
   */
  useEffect(() => {
    if (!audioContext) return;

    const interval = setInterval(() => {
      if (audioState === "playing") {
        setSec(s => +(s + 0.1).toFixed(1));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [audioContext, audioState]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * When the path changes, get the audio file as base64
   */
  useEffect(() => {
    setLoading(true);
    invoke<string>(CommandName.GetAudioBase64, { path })
      .then(res => {
        setSrc(convertSrcBase64(res, ext, "audio"));
      })
      .catch(console.error);
  }, [path]);

  /**
   * The frame id for the animation frame
   */
  let frameID = 0;

  /**
   * A ref to the source, to stop it when the component unmounts
   */
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  /**
   * Stop the audio source when the component unmounts
   */
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
    };
  }, []);

  /**
   * Decode the audio file and create a buffer source
   * Connect the source to the analyser and the analyser to the destination
   */
  const start = () => {
    if (!canvasRef.current) return;

    /**
     * Create a new audio context and analyser
     * This is needed to create an audio visualizer
     */
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const audioContext = new AudioContext();
    setAudioContext(audioContext);
    const analyser = audioContext.createAnalyser();

    fetch(src)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        source.start();

        setLoading(false);

        const duration = +source.buffer.duration.toFixed(1);

        setDuration(duration);
        setSec(0);
        setAudioState("playing");

        drawBars(analyser, context);

        /**
         * Set the source ref to the current source
         */
        sourceRef.current = source;

        /**
         * Stop the animation frame when the audio ends
         */
        source.onended = () => {
          cancelAnimationFrame(frameID);
          canvasRef.current
            ?.getContext("2d")
            ?.clearRect(0, 0, canvas.width, canvas.height);
          setSec(duration);
          setAudioState("over");
        };
      });
  };

  useEffect(() => {
    /**
     * Stop audio source when the source changes
     */
    if (sourceRef.current) {
      sourceRef.current.stop();
    }

    start();
  }, [src]);

  /**
   * Counter for the throttle rate
   * This is needed to save some performance
   */
  let frame = 0;

  /**
   * Draw the bars of the visualizer
   */
  const drawBars = (analyser: AnalyserNode, context: CanvasRenderingContext2D) => {
    frame++;

    /**
     * If the counter is not divisible by the throttle rate, return
     * This skips the frame
     */
    if (frame % THROTTLE_RATE_AUDIO_VISUALIZER !== 0) {
      frameID = requestAnimationFrame(() => drawBars(analyser, context));
      return;
    }

    /**
     * Get the frequency data and draw the bars
     * The bars are drawn with the frequency data
     */
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const barWidth = 4;
    let x = 0;

    /**
     * Draw the bars
     */
    for (let i = 0; i < array.length; i++) {
      const value = array.at(i);
      const barHeight = value / 2;

      const r = value + 25 * (i / array.length);
      const g = 250 * (i / array.length);
      const b = 50;

      context.fillStyle = `rgb(${r},${g},${b})`;
      context.fillRect(x, context.canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    frameID = requestAnimationFrame(() => drawBars(analyser, context));
  };

  const onClick = () => {
    switch (audioState) {
      case "playing": {
        audioContext?.suspend();
        setAudioState("paused");
        break;
      }

      case "paused": {
        audioContext?.resume();
        setAudioState("playing");
        break;
      }

      case "over": {
        restartAudio();

        break;
      }
    }
  };

  /**
   * Restart the audio
   */
  const restartAudio = () => {
    cancelAnimationFrame(frameID);
    start();
  };

  /**
   * Close the audio preview
   */
  const onClose = () => {
    cancelAnimationFrame(frameID);
    setSrc("");
    setSec(0);
    setDuration(0);
  };

  return (
    (loading || src) && (
      <div
        className={cn(
          "xl:w-[500px] xl:h-[300px]",
          "w-96 h-52",
          "absolute bottom-4 right-5",
          "grid place-items-center",
          "bg-[--slate-1]",
          "rounded-md",
          "border border-[--gray-6]",
          "z-40"
        )}
      >
        <canvas ref={canvasRef} className={cn("w-full h-full", "absolute", "p-2")} />

        <button
          className={cn(
            "w-fit h-fit",
            "absolute top-3 right-3",
            "inline-flex items-center justify-center"
          )}
          onClick={onClose}
        >
          <Cross1Icon />
        </button>

        {loading ? (
          <Spinner size={30} />
        ) : (
          <>
            <Slider max={duration} value={[sec]} />
            <source src={src} type={`audio/${ext}`} />
            <button
              className={cn(
                "w-fit h-fit",
                "absolute top-3",
                "inline-flex items-center justify-center"
              )}
              onClick={onClick}
            >
              {audioState === "over" ? (
                <ReloadIcon />
              ) : audioState === "playing" ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>
          </>
        )}
      </div>
    )
  );
};

export { AudioPreview };
