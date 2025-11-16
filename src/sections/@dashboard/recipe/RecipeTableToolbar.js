import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

RecipeTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function RecipeTableToolbar({ isFiltered, filterName, onFilterName }) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search recipes..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
