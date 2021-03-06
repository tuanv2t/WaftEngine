/**
 *
 * SubModules
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import * as mapDispatchToProps from './actions';
import { makeSelectAll, makeSelectLoading, makeSelectQuery } from './selectors';
import reducer from './reducer';
import saga from './saga';

import DeleteDialog from '../../../components/DeleteDialog';
import Loading from '../../../components/Loading';
import PageHeader from '../../../components/PageHeader/PageHeader';
import PageContent from '../../../components/PageContent/PageContent';
import Table from '../../../components/Table';
import lid from '../../../assets/img/lid.svg';
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa';
const key = 'subModules';

export const SubModules = props => {
  const {
    all: { data, page, size, totaldata },
    query,
    loading,
    classes,
    loadAllRequest,
    clearOne,
    setQueryValue,
    deleteOneRequest,
    push,
  } = props;

  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [open, setOpen] = useState(false);
  const [deletedId, setDeletedID] = useState('');

  useEffect(() => {
    loadAllRequest(query);
  }, [query.page, query.size]);

  const handleAdd = () => {
    clearOne();
    push('/admin/sub-modules/add');
  };

  const handleEdit = id => {
    push(`/admin/sub-modules/edit/${id}`);
  };

  const handleQueryChange = e => {
    e.persist();
    setQueryValue({ key: e.target.name, value: e.target.value });
  };

  const handleOpen = id => {
    setOpen(true);
    setDeletedID(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePagination = ({ page, size }) => {
    setQueryValue({ key: 'page', value: page });
    setQueryValue({ key: 'size', value: size });
  };

  const handleSearch = () => {
    loadAllRequest(query);
    setQueryValue({ key: 'page', value: 1 });
  };

  const handleDelete = id => {
    deleteOneRequest(id);
    setOpen(false);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const tablePagination = { page, size, totaldata };

  const tableData = data.map(
    ({ module_group, order, description, _id, module_group_main }) => [
      module_group,
      order,
      description,
      <>
        <div className="flex">
          <span
            className="w-8 h-8 inline-flex justify-center items-center leading-none cursor-pointer hover:bg-blue-100 rounded-full relative edit-icon"
            onClick={() => handleEdit(_id)}
          >
            <FaPencilAlt className="pencil" />
            <span className="bg-blue-500 dash" />
          </span>
        </div>
      </>,
    ],
  );

  return (
    <>
      <Helmet>
        <title>Module Group Manage</title>
      </Helmet>
      <DeleteDialog
        open={open}
        doClose={handleClose}
        doDelete={() => handleDelete(deletedId)}
      />
      <div className="flex justify-between my-3">
        {loading && loading == true ? <Loading /> : <></>}
        <PageHeader>Module Group Manage</PageHeader>
        <div className="flex items-center">
          <button
            className="bg-blue-500 border border-blue-600 px-3 py-2 leading-none inline-flex items-center cursor-pointer hover:bg-blue-600 transition-all duration-100 ease-in text-sm text-white rounded"
            onClick={handleAdd}
          >
            <FaPlus />
            <span className="pl-2">Add New</span>
          </button>
        </div>
      </div>
      <PageContent loading={loading}>
        <div className="inline-flex relative mr-4 w-64 mt-4">
          <input
            type="text"
            name="find_title"
            id="contents-title"
            placeholder="Search by title"
            className="m-auto inputbox pr-6"
            value={query.find_title}
            // value="test"
            onChange={handleQueryChange}
            onKeyPress={handleKeyPress}
          />
          <span
            className="inline-flex border-l absolute right-0 top-0 h-8 px-2 mt-1 items-center cursor-pointer text-blue-500"
            onClick={handleSearch}
          >
            <FaSearch />
          </span>
        </div>

        <Table
          tableHead={['Module Group', 'Order', 'Description', 'Action']}
          tableData={tableData}
          pagination={tablePagination}
          handlePagination={handlePagination}
        />
      </PageContent>
    </>
  );
};

SubModules.propTypes = {
  loadAllRequest: PropTypes.func.isRequired,
  all: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    totaldata: PropTypes.number.isRequired,
  }),
  push: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  all: makeSelectAll(),
  query: makeSelectQuery(),
  loading: makeSelectLoading(),
});

const withConnect = connect(mapStateToProps, { ...mapDispatchToProps, push });

export default compose(withConnect, memo)(SubModules);
