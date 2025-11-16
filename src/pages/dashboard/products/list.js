import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import ProductTableRow from '../../../sections/@dashboard/product/ProductTableRow';
import ProductTableToolbar from '../../../sections/@dashboard/product/ProductTableToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'vendors', label: 'Vendors', align: 'center' },
  { id: 'default_price', label: 'Default Price', align: 'right' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

ProductManagementPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ProductManagementPage() {
  const router = useRouter();
  const { themeStretch } = useSettingsContext();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const result = await response.json();

      if (result.success) {
        setTableData(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        fetchProducts();
        setOpenConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditRow = (id) => {
    router.push(`/dashboard/products/entry?id=${id}`);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound = !dataFiltered.length && isFiltered;

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Product Management"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Products', href: '/dashboard/products/list' },
          { name: 'List' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => router.push('/dashboard/products/entry')}
          >
            Add Product
          </Button>
        }
      />

      <Card>
        <ProductTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          onFilterName={handleFilterName}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <ProductTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure you want to delete this product?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        }
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (product) =>
        product.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        (product.description &&
          product.description.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
    );
  }

  return inputData;
}
