import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";

// How often a new caption "page" starts. Higher = more words per page.
const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const Captions: React.FC<{ src: string }> = ({ src }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading captions"));
  const { fps } = useVideoConfig();

  const load = useCallback(async () => {
    try {
      const res = await fetch(src);
      setCaptions((await res.json()) as Caption[]);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [src, handle, continueRender, cancelRender]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = useMemo(() => {
    if (!captions) return [];
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    }).pages;
  }, [captions]);

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const from = Math.floor((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : page.startMs + SWITCH_CAPTIONS_EVERY_MS;
        const duration = Math.max(1, Math.ceil(((endMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={duration} layout="none">
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Time in ms relative to the whole video (Sequence resets frame to 0 at page start).
  const absoluteMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
      <div
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          whiteSpace: "pre",
          textShadow: "0 4px 16px rgba(0,0,0,0.8)",
        }}
      >
        {page.tokens.map((t) => {
          const active = t.fromMs <= absoluteMs && t.toMs > absoluteMs;
          return (
            <span key={t.fromMs} style={{ color: active ? "#ffd60a" : "white" }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
