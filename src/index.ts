import { useEffect, useMemo, useState } from "react";

export type DeviceType = "mouseOnly" | "touchOnly" | "hybrid";
export type PrimaryInput = "mouse" | "touch";

function getMaxScreenWidth() {
  if (typeof window === "undefined" || !window.screen) return 0;
  return Math.max(window.screen.width, window.screen.height);
}

export function useDeviceDetection(isReactive?: boolean) {
  const [deviceType, setDeviceType] = useState<DeviceType>("mouseOnly");
  const [primaryInput, setPrimaryInput] = useState<PrimaryInput>("mouse");

  const maxWidth = useMemo(() => getMaxScreenWidth(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDeviceInfo = () => {
      const isPrimaryFine = window.matchMedia("(pointer: fine)").matches;
      const isPrimaryHover = window.matchMedia("(hover: hover)").matches;
      const isAnyFine = window.matchMedia("(any-pointer: fine)").matches;
      const isAnyHover = window.matchMedia("(any-hover: hover)").matches;
      const isAnyCoarse = window.matchMedia("(any-pointer: coarse)").matches;

      let newDeviceType: DeviceType;
      let newPrimaryInput: PrimaryInput;

      if (isAnyCoarse && !isAnyHover) {
        newPrimaryInput = "touch";
        newDeviceType = "touchOnly";
      } else if (isAnyFine && !isAnyCoarse && isAnyHover) {
        newPrimaryInput = "mouse";
        newDeviceType = "mouseOnly";
      } else {
        newDeviceType = "hybrid";
        newPrimaryInput = isPrimaryFine && isPrimaryHover ? "mouse" : "touch";
      }

      setDeviceType(newDeviceType);
      setPrimaryInput(newPrimaryInput);
    };

    updateDeviceInfo();

    if (isReactive) {
      window.addEventListener("resize", updateDeviceInfo);
      window.addEventListener("orientationchange", updateDeviceInfo);
      return () => {
        window.removeEventListener("resize", updateDeviceInfo);
        window.removeEventListener("orientationchange", updateDeviceInfo);
      };
    }
  }, [isReactive]);

  return { deviceType, primaryInput, maxWidth };
}
