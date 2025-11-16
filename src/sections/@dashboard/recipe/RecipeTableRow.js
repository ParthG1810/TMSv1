import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, IconButton } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

RecipeTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function RecipeTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const { name, description, total_cost } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{name}</TableCell>
      <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {description || 'N/A'}
      </TableCell>
      <TableCell align="right">${total_cost ? parseFloat(total_cost).toFixed(2) : '0.00'}</TableCell>
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
