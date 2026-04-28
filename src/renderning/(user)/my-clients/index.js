'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbClients } from '@/store/slice/ibUserSlice';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import ClientModal from '@/components/modal/clientModal';
import styles from './myClients.module.scss';
import moment from 'moment';
import Loader from '@/components/Loader';
import Pagination from '@/components/pagination';

const LIMIT = 10;

const MY_CLIENTS_FILTER_GROUPS = [
  {
    group: 'Select Date Range',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
    ],
  },
  {
    group: 'Select Profit Range',
    fields: [
      {
        key: 'minProfit',
        label: 'Min',
        type: 'number',
        placeholder: 'Min Profit',
      },
      {
        key: 'maxProfit',
        label: 'Max',
        type: 'number',
        placeholder: 'Max Profit',
      },
    ],
  },
  {
    group: 'Select Deposit Range',
    fields: [
      {
        key: 'minDeposit',
        label: 'Min',
        type: 'number',
        placeholder: 'Min Deposit',
      },
      {
        key: 'maxDeposit',
        label: 'Max',
        type: 'number',
        placeholder: 'Max Deposit',
      },
    ],
  },
];

export default function MyClients() {
  const dispatch = useDispatch();
  const { ibClients, ibClientsLoading, ibClientsError, ibClientsTotalPages } =
    useSelector((state) => state.ibUser);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);

  const debounceRef = useRef(null);

  const loadData = useCallback(
    (page, searchVal, filters) => {
      const params = { page, limit: LIMIT };
      if (searchVal) params.search = searchVal;
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });
      dispatch(fetchIbClients(params));
    },
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    loadData(1, '', {});
  }, [loadData]);

  // Re-fetch when page changes
  useEffect(() => {
    loadData(currentPage, search, activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      loadData(1, val, activeFilters);
    }, 400);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadData(1, search, filters);
  };

  if (ibClientsLoading) {
    return (
      <Loader variant="dots" size="large" color="success" text="Loading..." />
    );
  }

  if (ibClientsError) {
    return (
      <p
        style={{
          color: '#ff4d4d',
          textAlign: 'center',
          padding: '2rem',
          fontSize: 14,
        }}
      >
        Failed to load clients.
      </p>
    );
  }

  return (
    <>
      <DataTableHeader
        onSearch={handleSearch}
        filterModal={
          <FilterModal
            onApply={handleApplyFilters}
            fieldGroups={MY_CLIENTS_FILTER_GROUPS}
          />
        }
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date Referred</th>
              <th>Name</th>
              <th>Email</th>
              <th>Deposit</th>
              <th>Profit</th>
              <th className={styles.actionCol}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!ibClients || ibClients.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyRow}>
                  {search || Object.keys(activeFilters).length > 0
                    ? 'No clients match your search.'
                    : 'No clients found.'}
                </td>
              </tr>
            ) : (
              ibClients.map((client, i) => {
                const user = client?.user || client;
                const name =
                  `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                  '—';
                const email = user?.email || '—';
                const dateReferred = client?.createdAt
                  ? moment(client.createdAt).format('DD-MM-YYYY | hh:mm A')
                  : '—';
                const deposit = client?.deposit ?? client?.totalDeposit ?? '—';
                const profit = client?.totalProfit ?? '—';

                return (
                  <tr key={client?.id || client?._id || i}>
                    <td>{dateReferred}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>
                      {deposit !== '—' ? Number(deposit).toLocaleString() : '—'}
                    </td>
                    <td>
                      {profit !== '—' ? Number(profit).toLocaleString() : '—'}
                    </td>
                    <td className={styles.actionCol}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setSelectedClient(client)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {ibClientsTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={ibClientsTotalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
}
