import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, IconButton, Chip, Stack } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ProductTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const { name, description, vendors } = row;

  const defaultVendor = vendors?.find((v) => v.is_default) || vendors?.[0];

  return (
    <TableRow hover selected={selected}>
      <TableCell>{name}</TableCell>
      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {description || 'N/A'}
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          {vendors?.map((vendor, index) => (
            <Chip
              key={index}
              label={vendor.vendor_name}
              size="small"
              color={vendor.is_default ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </TableCell>
      <TableCell align="right">
        {defaultVendor ? `$${defaultVendor.price}` : 'N/A'}
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={onEditRow}>
          <Iconify icon="eva:edit-fill" />
        </IconButton>
        <IconButton onClick={onDeleteRow} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
