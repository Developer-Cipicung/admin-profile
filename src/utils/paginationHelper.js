export const handlePaginationAfterDelete = ({ itemsLength, currentPage, setPage, refresh }) => {
  if (itemsLength === 1 && currentPage > 1) {
    setPage(currentPage - 1);
  } else {
    refresh();
  }
};
