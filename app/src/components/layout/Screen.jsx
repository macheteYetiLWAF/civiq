export default function Screen({ children, noPadding = false, noNav = false, noHeader = false }) {
  // Header height is approx 52px + safe area inset (12px padding top + ~28px content + 12px padding bottom)
  const headerHeight = 52;
  // PA Facts ticker (~44px) + nav bar (~46px) + safe area + extra buffer
  const bottomSpace = 120;

  return (
    <main
      className="screen"
      style={{
        padding: noPadding ? 0 : '16px',
        paddingTop: noHeader
          ? (noPadding ? 0 : '16px')
          : `calc(${headerHeight}px + env(safe-area-inset-top, 0px) + ${noPadding ? 0 : 16}px)`,
        paddingBottom: noNav ? '16px' : `calc(${bottomSpace}px + env(safe-area-inset-bottom, 0px))`
      }}
    >
      {children}
    </main>
  );
}
