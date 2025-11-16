import PropTypes from 'prop-types';
import ThemeContrast from './ThemeContrast';
import ThemeRtlLayout from './ThemeRtlLayout';
import SettingsDrawer from './drawer';

// ----------------------------------------------------------------------

ThemeSettings.propTypes = {
  children: PropTypes.node,
};

export default function ThemeSettings({ children }) {
  return (
    <ThemeContrast>
      <ThemeRtlLayout>
        {children}
        <SettingsDrawer />
      </ThemeRtlLayout>
    </ThemeContrast>
  );
}
