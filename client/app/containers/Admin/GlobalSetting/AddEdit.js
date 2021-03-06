/**
 *
 * GlobalSetting
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { push } from 'connected-react-router';

import PageHeader from '../../../components/PageHeader/PageHeader';
import PageContent from '../../../components/PageContent/PageContent';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import * as mapDispatchToProps from './actions';
import { makeSelectLoading, makeSelectOne } from './selectors';
import reducer from './reducer';
import saga from './saga';
import Loading from '../../../components/Loading';
import Table from '../../../components/Table';
import {
  FaPencilAlt,
  FaPlus,
  FaArrowLeft,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { enqueueSnackbar } from '../../App/actions';
import CKEditor from 'react-ckeditor-component';

const key = 'globalSetting';

export const GlobalSetting = props => {
  const {
    loading,
    one,
    loadOneRequest,
    push,
    setOneValue,
    saveRequest,
    enqueueSnackbar,
  } = props;
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [errors, setError] = useState('');
  const [tempVal, setTempVal] = useState('');

  useEffect(() => {
    if (props.match.params && props.match.params.id) {
      loadOneRequest(props.match.params.id);
    }
  }, []);

  const handleChange = name => event => {
    event.persist();
    setOneValue({ key: name, value: event.target.value });
    if (name === 'value_type' && event.target.value === 'Boolean') {
      setOneValue({ key: 'value', value: 'true' });
    }
    if (name === 'value_type' && event.target.value === 'Array') {
      setOneValue({ key: 'value', value: [] });
    }
    if (
      name === 'value_type' &&
      event.target.value !== 'Boolean' &&
      event.target.value !== 'Array'
    ) {
      setOneValue({ key: 'value', value: '' });
    }
  };

  const handleEditorChange = (e, name) => {
    const newContent = e.editor.getData();
    setOneValue({ key: name, value: newContent });
  };

  const handleCheckedChange = name => event => {
    event.persist();
    setOneValue({ key: name, value: event.target.checked });
  };

  const handleBack = () => {
    push('/admin/global-setting');
  };

  const handleSave = () => {
    if (one.type.trim() === '') {
      setError('Type is required');
      const snackbarData = {
        message: 'Type is required',
        options: {
          variant: 'warning',
        },
      };
      enqueueSnackbar(snackbarData);
    } else {
      saveRequest();
    }
  };

  const handleTempValue = event => {
    setTempVal(event.target.value);
  };

  const insertTags = event => {
    event.preventDefault();
    if (tempVal.trim() !== '') {
      if (one.value.indexOf(tempVal) === -1) {
        setOneValue({
          key: 'value',
          value: [...one.value, tempVal],
        });
        setTempVal('');
      }
    }
    return { tempVal: setTempVal('') };
  };

  const handleDelete = index => () => {
    const chipData = [...one.value];
    chipData.splice(index, 1);
    setOneValue({
      key: 'value',
      value: chipData,
    });
  };

  return (
    <>
      <Helmet>
        <title>Global Settings </title>
      </Helmet>
      <div className="flex justify-between my-3">
        {loading && loading == true ? <Loading /> : <></>}
        <PageHeader>
          <span className="backbtn" onClick={handleBack}>
            <FaArrowLeft className="text-xl" />
          </span>
          Global Setting {props.match.params.id ? 'Edit' : 'Add'}
        </PageHeader>
      </div>
      <PageContent loading={loading}>
        <div className="w-full md:w-1/2 pb-4">
          <label>Key</label>
          <input
            className="inputbox"
            id="key"
            type="text"
            name="key"
            value={one.key || ''}
            onChange={handleChange('key')}
          />
        </div>
        <div className="w-full md:w-1/2 pb-4">
          <label>Value Type </label>
          <select
            className="inputbox"
            id="value type"
            name="value type"
            value={one.value_type || ''}
            onChange={handleChange('value_type')}
          >
            <option value="Boolean">Boolean</option>
            <option value="Free text">Free text</option>
            <option value="Number">Number</option>
            <option value="ck_editor">Ck editor</option>
            <option value="Array">Array</option>
          </select>
        </div>
        {one.value_type === 'Boolean' && (
          <div className="w-full md:w-1/2 pb-4">
            <label>Value</label>
            <select
              className="inputbox"
              id="value"
              type="text"
              name="value"
              value={`${one.value}` || ''}
              onChange={handleChange('value')}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )}
        {one.value_type === 'Free text' && (
          <div className="w-full md:w-1/2 pb-4">
            <label>Value</label>
            <input
              className="inputbox"
              id="value"
              type="text"
              name="value"
              value={one.value || ''}
              onChange={handleChange('value')}
            />
          </div>
        )}
        {one.value_type === 'Number' && (
          <div className="w-full md:w-1/2 pb-4">
            <label>Value</label>
            <input
              className="inputbox"
              id="value"
              type="number"
              name="value"
              value={one.value || ''}
              onChange={handleChange('value')}
            />
          </div>
        )}
        {one.value_type === 'ck_editor' && (
          <div className="w-full md:w-1/2 pb-4">
            <label>Value</label>
            <CKEditor
              name="Answer"
              content={one && one.value}
              config={{ allowedContent: true }}
              events={{
                change: e => handleEditorChange(e, 'value'),
                value: (one && one.value) || '',
              }}
            />
          </div>
        )}

        {one.value_type === 'Array' && (
          <div className="w-full md:w-1/2 pb-4">
            <label htmlFor="blog-tags">Value</label>
            <form onSubmit={insertTags}>
              <input
                className="inputbox"
                id="blog-tags"
                type="text"
                value={tempVal || ''}
                name="val"
                onChange={handleTempValue}
              />
            </form>
            {one.value.map((val, index) => (
              <label className="tag" key={`${val}-${index}`}>
                {val}
                <span>
                  <FaTimes onClick={handleDelete(index)} />
                </span>
              </label>
            ))}
          </div>
        )}
        <div className="w-full md:w-1/2 pb-4">
          <label>Type</label>
          <input
            className="inputbox"
            id="type"
            type="text"
            name="type"
            value={one.type || ''}
            onChange={handleChange('type')}
          />
          {errors && errors !== '' ? (
            <div className="error"> This Field is required </div>
          ) : null}
        </div>
        <div className="w-full md:w-1/2 pb-4">
          <label>Sub Type</label>
          <input
            className="inputbox"
            id="sub_type"
            type="text"
            name="sub_type"
            value={one.sub_type || ''}
            onChange={handleChange('sub_type')}
          />
        </div>
        <div className="w-full md:w-1/2 pb-4">
          <label>Description</label>
          <textarea
            className="inputbox"
            id="description"
            type="text"
            name="description"
            value={one.description || ''}
            onChange={handleChange('description')}
          />
        </div>

        <div className="checkbox">
          <input
            onClick={handleCheckedChange('is_active')}
            checked={one.is_active || false}
            id="is_active"
            type="checkbox"
            onChange={null}
          />
          <label htmlFor="is_active">
            <span className="box">
              <FaCheck className="check-icon" />
            </span>
            Is Active
          </label>
        </div>
        <div className="checkbox">
          <input
            onClick={handleCheckedChange('is_removable')}
            checked={one.is_removable || false}
            id="is_removable"
            type="checkbox"
            onChange={null}
          />
          <label htmlFor="is_removable">
            <span className="box">
              <FaCheck className="check-icon" />
            </span>
            Is Removable
          </label>
        </div>
        <div className="w-full md:w-1/2 pb-4">
          <button
            className="block btn text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
            type="button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </PageContent>
    </>
  );
};

GlobalSetting.propTypes = {
  loadOneRequest: PropTypes.func.isRequired,
  one: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  one: makeSelectOne(),
  loading: makeSelectLoading(),
});

const withConnect = connect(mapStateToProps, {
  ...mapDispatchToProps,
  push,
  enqueueSnackbar,
});
export default compose(withConnect, memo, withRouter)(GlobalSetting);
