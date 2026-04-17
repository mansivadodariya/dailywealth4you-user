'use client'
import React from 'react'
import styles from './dropdown.module.scss';
import Select, { components } from 'react-select'

const DownIcon = '/assets/icons/down.svg'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <img src={DownIcon} alt="DownIcon" style={{ width: '12px' }} />
        </components.DropdownIndicator>
    );
};

export default function Dropdown({ label }) {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: 'rgba(255, 255, 255, 0.04)',
            border: state.isFocused ? '1px solid #DBE64C' : '1px solid transparent',
            borderRadius: '8px',
            minHeight: '40px',
            height: '40px',
            color: '#fafafa',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: 'none',
            '&:hover': {
                border: state.isFocused ? '1px solid #DBE64C' : '1px solid rgba(255, 255, 255, 0.1)',
            },
            cursor: 'pointer',
            paddingLeft: '6px',
            transition: 'all 0.3s ease',
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 8px',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#fafafa',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#8e8e8e',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: state.isFocused ? '#DBE64C' : '#fafafa',
            paddingRight: '12px',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease',
        }),
        menu: (provided) => ({
            ...provided,
            background: '#0D1919',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            zIndex: 10,
            marginTop: '8px',
            padding: '4px',
        }),
        option: (provided, state) => ({
            ...provided,
            background: state.isSelected
                ? '#DBE64C'
                : state.isFocused
                    ? 'rgba(219, 230, 76, 0.1)'
                    : 'transparent',
            color: state.isSelected ? '#030f0f' : '#fafafa',
            cursor: 'pointer',
            fontSize: '14px',
            borderRadius: '4px',
            margin: '2px 0',
            '&:active': {
                background: '#02df82',
                color: '#030f0f',
            },
            transition: 'all 0.2s ease',
        }),
    };


    return (
        <div className={styles.dropdown}>
            <label>
                {label}
            </label>
            <div className={styles.dropdownWrap}>
                <Select
                    options={options}
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    placeholder="Select..."
                />
            </div>
        </div>
    )
}

