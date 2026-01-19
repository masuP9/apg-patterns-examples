import { Volume2, VolumeOff, Sun, Moon, Bell, BellOff } from 'lucide-react';
import { ToggleButton } from './ToggleButton';

export function MuteDemo() {
  return (
    <ToggleButton
      pressedIndicator={<VolumeOff size={20} />}
      unpressedIndicator={<Volume2 size={20} />}
    >
      Mute
    </ToggleButton>
  );
}

export function DarkModeDemo() {
  return (
    <ToggleButton
      initialPressed={true}
      pressedIndicator={<Moon size={20} />}
      unpressedIndicator={<Sun size={20} />}
    >
      Dark Mode
    </ToggleButton>
  );
}

export function NotificationsDemo() {
  return (
    <ToggleButton
      pressedIndicator={<BellOff size={20} />}
      unpressedIndicator={<Bell size={20} />}
      disabled
    >
      Notifications
    </ToggleButton>
  );
}
