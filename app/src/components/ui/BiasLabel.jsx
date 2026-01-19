import './BiasLabel.css';

const biasConfig = {
  left: {
    label: 'Left',
    className: 'bias-label-left'
  },
  'lean-left': {
    label: 'Lean Left',
    className: 'bias-label-lean-left'
  },
  center: {
    label: 'Center',
    className: 'bias-label-center'
  },
  'lean-right': {
    label: 'Lean Right',
    className: 'bias-label-lean-right'
  },
  right: {
    label: 'Right',
    className: 'bias-label-right'
  },
  official: {
    label: 'Official',
    className: 'bias-label-official'
  }
};

export default function BiasLabel({ bias = 'center' }) {
  const config = biasConfig[bias] || biasConfig.center;

  return (
    <span className={`bias-label ${config.className}`}>
      {config.label}
    </span>
  );
}
