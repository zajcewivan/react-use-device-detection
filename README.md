# react-use-device-detection

React hook for detecting device type and primary input

## Installation

```bash
npm install react-use-device-detection
```

## Usage

```jsx
import { useDeviceDetection } from "react-use-device-detection";

const Component = () => {
  const { deviceType, primaryInput, maxWidth } = useDeviceDetection(true);

  return (
    <div>
      Device: {deviceType} | Input: {primaryInput} | Max width: {maxWidth}
    </div>
  );
};
```

## API

### `useDeviceDetection(isReactive?: boolean)`

Returns:

- `deviceType`: `"mouseOnly" | "touchOnly" | "hybrid"`
- `primaryInput`: `"mouse" | "touch"`
- `maxWidth`: Max screen dimension (static value)

#### Parameters

- `isReactive` (optional): Update on resize/orientation change (default: `false`)
