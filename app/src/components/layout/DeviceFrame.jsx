export default function DeviceFrame({ children }) {
  return (
    <div className="device-frame-wrapper">
      <div className="device-frame">
        <div className="device-notch"></div>
        {children}
      </div>
    </div>
  );
}
