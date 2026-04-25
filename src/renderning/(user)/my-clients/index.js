'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbClients } from '@/store/slice/ibUserSlice';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import ClientModal from '@/components/modal/clientModal';
import styles from './myClients.module.scss';
import moment from 'moment';
import Loader from '@/components/Loader';
import Pagination from '@/components/pagination';

const ITEMS_PER_PAGE = 10;

// My Clients filter fields: date, profit, deposit
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
  const { ibClients, ibClientsLoading, ibClientsError } = useSelector(
    (state) => state.ibUser
  );
  //   console.log(ibClients, "ibClients")

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    dispatch(fetchIbClients());
  }, [dispatch]);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    // Client-side filter applied below — wire to API when backend supports it
  };

  const filtered = (ibClients || []).filter((client) => {
    const user = client?.user || client;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const name =
        `${user?.firstName || ''} ${user?.lastName || ''}`.toLowerCase();
      const email = (user?.email || '').toLowerCase();
      if (!name.includes(q) && !email.includes(q)) return false;
    }

    // Date filter
    if (activeFilters.startDate && client?.createdAt) {
      if (new Date(client.createdAt) < new Date(activeFilters.startDate))
        return false;
    }
    if (activeFilters.endDate && client?.createdAt) {
      if (
        new Date(client.createdAt) >
        new Date(activeFilters.endDate + 'T23:59:59')
      )
        return false;
    }

    // Profit filter
    const profit = client?.totalProfit ?? 0;
    if (
      activeFilters.minProfit !== undefined &&
      profit < Number(activeFilters.minProfit)
    )
      return false;
    if (
      activeFilters.maxProfit !== undefined &&
      profit > Number(activeFilters.maxProfit)
    )
      return false;

    // Deposit filter
    const deposit = client?.deposit ?? client?.totalDeposit ?? 0;
    if (
      activeFilters.minDeposit !== undefined &&
      deposit < Number(activeFilters.minDeposit)
    )
      return false;
    if (
      activeFilters.maxDeposit !== undefined &&
      deposit > Number(activeFilters.maxDeposit)
    )
      return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (ibClientsLoading) {
    return (
      <Loader
        fullScreen
        variant="dots"
        size="large"
        color="success"
        text="Loading clients..."
      />
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
        onSearch={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyRow}>
                  {search
                    ? 'No clients match your search.'
                    : 'No clients found.'}
                </td>
              </tr>
            ) : (
              paginated.map((client, i) => {
                const user = client?.user || client;
                const name =
                  `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                  '—';
                const email = user?.email || '—';
                const dateReferred = client?.createdAt
                  ? moment(client.createdAt).format('DD-MM-YYYY |  hh:mm A')
                  : '—';
                const deposit = client?.deposit ?? client?.totalDeposit ?? '—';
                const profit = client?.totalProfit ?? '—';

                return (
                  <tr key={client?.id || client?._id || i}>
                    <td>{dateReferred}.</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>
                      {deposit !== '—'
                        ? `$${Number(deposit).toLocaleString()}`
                        : '—'}
                    </td>
                    <td>
                      {profit !== '—'
                        ? `$${Number(profit).toLocaleString()}`
                        : '—'}
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
