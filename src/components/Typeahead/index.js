/* eslint jsx-a11y/label-has-associated-control: "off",
jsx-a11y/label-has-for: "off" */ // These attributes are generated by the Downshift library

import React, { Component } from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import { findAll } from 'highlight-words-core';

import { colours, mq } from '../../theme/airways';
import noop from '../../utils/noop';

// TODO: Add props for listHeight and loadingText and bottom padding

function typeaheadStyles() {
  return {
    lineHeight: 1.53,
    display: 'flex',
    flexDirection: 'column',
    height: '100%' // TODO: make height configurable
  };
}

function labelInputContainerStyles() {
  return {
    width: '100%',
    padding: '0px',
    boxSizing: 'border-box'
  };
}

function inputStyles() {
  return {
    border: 'solid 2px #8de2e0',
    fontFamily: 'Ciutadella',
    fontSize: '22px',
    boxSizing: 'border-box',
    '&:focus': {
      outlineColor: colours.highlights
    },
    width: '100%',
    padding: '14px 10px 10px 10px',
    borderRadius: '0px',
    '-webkit-appearance': 'none'
  };
}

function labelStyles() {
  return {
    fontFamily: 'Ciutadella',
    fontSize: '16px',
    fontWeight: '',
    lineHeight: 1.75,
    color: '#323232',
    textTransform: 'none'
  };
}

const menuWrapStyles = {
  maxHeight: 'none',
  flexGrow: 1,
  overflowX: 'hidden',
  overflowY: 'scroll',
  [mq.medium]: {
    maxHeight: '285px',
    height: '100%'
  }
};

// TODO: find alternative solution to padding. Remove the padding bottom so its not there forever not even as a prop

function menuStyles() {
  return {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    margin: '10px 0',
    paddingBottom: '303px',
    [mq.medium]: {
      padding: 0
    }
  };
}

function listItemStyles(isHighlighted) {
  return {
    backgroundColor: isHighlighted ? '#f4f5f6' : colours.transparent,
    borderRadius: '2px',
    listStyleType: 'none',
    padding: '16px 10px',
    fontFamily: 'Ciutadella',
    fontSize: '18px',
    lineHeight: 1,
    color: '#323232',
    display: 'flex',
    justifyContent: 'space-between'
  };
}

function listItemBadgeStyles() {
  return {
    fontSize: '16px',
    textAlign: 'right',
    borderRadius: '3px',
    backgroundColor: '#8de2e0',
    fontWeight: 600,
    padding: '2px 3px 0px',
    height: '100%'
  };
}

function highlightedListItemStyles() {
  return {
    fontWeight: 600
  };
}

class Typeahead extends Component {
  constructor(props) {
    super(props);

    const { placeholder } = props;

    this.state = {
      placeholder
    };
  }

  componentDidMount() {
    if (typeof this.props.setRef === 'function' && this.inputRef) {
      this.props.setRef(this.inputRef);
    }
  }

  onInputValueChange = (value, stateAndHelpers) => {
    const { fetchListOnInput } = this.props;
    if (
      fetchListOnInput &&
      stateAndHelpers.type === Downshift.stateChangeTypes.changeInput
    ) {
      fetchListOnInput(value);
    }
  };

  filterItems = (items, inputValue) => {
    const { itemToString, filterItems } = this.props;
    return filterItems
      ? filterItems(items, inputValue)
      : items.filter(item => {
          const regex = new RegExp(inputValue, 'gi');
          return regex.test(itemToString(item));
        });
  };

  renderItems = (
    getMenuProps,
    getItemProps,
    highlightedIndex,
    selectedItem,
    inputValue
  ) => {
    const { items, itemToString, fetchListOnInput, badgeToString } = this.props;
    const filteredItems = fetchListOnInput
      ? items
      : this.filterItems(items, inputValue);

    return filteredItems.length ? (
      <ul {...getMenuProps()} css={menuStyles()}>
        {filteredItems.map((item, index) => {
          const isHighlighted = highlightedIndex === index;
          const isSelected = selectedItem === item;

          const text = itemToString(item);
          const chunks = findAll({
            searchWords: [inputValue],
            textToHighlight: text
          });
          const highlightedItem = chunks.map(({ start, end, highlight }) => {
            const textChunk = text.substr(start, end - start);
            return highlight ? (
              <strong css={highlightedListItemStyles()}>{textChunk}</strong>
            ) : (
              textChunk
            );
          });
          const badge = badgeToString(item);

          return (
            <li
              key={itemToString(item)}
              {...getItemProps({
                index,
                item
              })}
              css={listItemStyles(isHighlighted, isSelected)}
            >
              <span>{highlightedItem}</span>
              {badge && <span css={listItemBadgeStyles()}>{badge}</span>}
            </li>
          );
        })}
      </ul>
    ) : (
      <div css={{ height: '285px' }} />
    );
  };

  setInputRef = el => {
    this.inputRef = el;
  };

  render() {
    const {
      disabled,
      id,
      initialSelectedItem,
      isFetchingList,
      itemToString,
      label,
      minChars,
      onBlur,
      onFocus,
      onChange,
      message,
      stateReducer,
      valid,
      selectItemCollector,
      maxLength
    } = this.props;

    const { placeholder } = this.state;

    return (
      <Downshift
        initialSelectedItem={initialSelectedItem}
        isFetchingList={isFetchingList}
        itemToString={itemToString}
        onChange={onChange}
        onInputValueChange={this.onInputValueChange}
        stateReducer={stateReducer}
      >
        {({
          setState,
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
          selectItem
        }) => {
          if (selectItemCollector) {
            selectItemCollector(selectItem);
          }
          return (
            <div css={typeaheadStyles()}>
              <div css={labelInputContainerStyles()}>
                {label && (
                  <label {...getLabelProps()} css={labelStyles()}>
                    {label}
                  </label>
                )}
                <input
                  css={inputStyles()}
                  {...getInputProps({
                    disabled,
                    id,
                    placeholder,
                    maxLength,
                    onFocus: e => {
                      setState({
                        inputValue: ''
                      });
                      this.setState({
                        placeholder: e.target.value
                      });
                      onFocus();
                    },
                    onBlur: () => {
                      setState({
                        inputValue: itemToString(selectedItem),
                        placeholder: ''
                      });
                      this.setState({
                        placeholder: ''
                      });
                      onBlur();
                    },
                    ref: this.setInputRef
                  })}
                />
              </div>
              <div css={menuWrapStyles} ref={this.props.listRef}>
                {isOpen && !isFetchingList && inputValue.length >= minChars ? (
                  this.renderItems(
                    getMenuProps,
                    getItemProps,
                    highlightedIndex,
                    selectedItem,
                    inputValue
                  )
                ) : (
                  <div css={{ height: '285px' }}>
                    {isFetchingList && (
                      <div css={{ padding: '16px 10px' }}>
                        Loading airports...
                      </div>
                    )}
                    {message && !valid && <div>{message}</div>}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Downshift>
    );
  }
}

Typeahead.propTypes = {
  disabled: PropTypes.bool,
  fetchListOnInput: PropTypes.func,
  id: PropTypes.string,
  initialSelectedItem: PropTypes.shape(),
  isFetchingList: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape),
  itemToString: PropTypes.func,
  badgeToString: PropTypes.func,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  onInputValueChange: PropTypes.func,
  filterItems: PropTypes.func,
  message: PropTypes.string,
  minChars: PropTypes.number,
  placeholder: PropTypes.string,
  stateReducer: PropTypes.func,
  valid: PropTypes.bool,
  selectItemCollector: PropTypes.func,
  setRef: PropTypes.func,
  maxLength: PropTypes.number
};

Typeahead.defaultProps = {
  ...Downshift.propTypes,
  disabled: false,
  fetchListOnInput: undefined,
  id: null,
  initialSelectedItem: null,
  isFetchingList: false,
  itemToString: item => (item ? String(item) : ''),
  badgeToString: () => null,
  items: [],
  label: '',
  onBlur: noop,
  onFocus: noop,
  onChange: noop,
  onInputValueChange: null,
  setRef: noop,
  message: '',
  minChars: 0,
  placeholder: '',
  stateReducer: undefined,
  valid: true,
  maxLength: 100
};

export default Typeahead;
