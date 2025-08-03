import { useEffect, useMemo, useState } from "react";

export type DeviceType = "mouseOnly" | "touchOnly" | "hybrid";
export type PrimaryInput = "mouse" | "touch";
export type DeviceInfo = {
  deviceType: DeviceType;
  primaryInput: PrimaryInput;
};

function getMaxScreenWidth() {
  if (typeof window === "undefined" || !window.screen) return 0;
  return Math.max(window.screen.width, window.screen.height);
}

const detectDeviceInfo = (): DeviceInfo => {
  const isPrimaryFine = window.matchMedia("(pointer: fine)").matches;
  const isPrimaryHover = window.matchMedia("(hover: hover)").matches;
  const isAnyFine = window.matchMedia("(any-pointer: fine)").matches;
  const isAnyHover = window.matchMedia("(any-hover: hover)").matches;
  const isAnyCoarse = window.matchMedia("(any-pointer: coarse)").matches;

  let deviceType: DeviceType;
  let primaryInput: PrimaryInput;

  if (isAnyCoarse && !isAnyHover) {
    primaryInput = "touch";
    deviceType = "touchOnly";
  } else if (isAnyFine && !isAnyCoarse && isAnyHover) {
    primaryInput = "mouse";
    deviceType = "mouseOnly";
  } else {
    deviceType = "hybrid";
    primaryInput = isPrimaryFine && isPrimaryHover ? "mouse" : "touch";
  }

  return { deviceType, primaryInput };
};

const initDeviceInfoState = (): DeviceInfo => {
  if (typeof window !== "undefined") {
    return detectDeviceInfo();
  }
  return { deviceType: "mouseOnly", primaryInput: "mouse" };
};

export function useDeviceDetection(isReactive?: boolean) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(initDeviceInfoState);

  const maxWidth = useMemo(() => getMaxScreenWidth(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDeviceInfo = () => {
      const newDeviceInfo = detectDeviceInfo();
      setDeviceInfo(newDeviceInfo);
    };

    if (isReactive) {
      window.addEventListener("resize", updateDeviceInfo);
      window.addEventListener("orientationchange", updateDeviceInfo);
      return () => {
        window.removeEventListener("resize", updateDeviceInfo);
        window.removeEventListener("orientationchange", updateDeviceInfo);
      };
    }
  }, [isReactive]);

  return {
    deviceType: deviceInfo.deviceType,
    primaryInput: deviceInfo.primaryInput,
    maxWidth,
  };
}
