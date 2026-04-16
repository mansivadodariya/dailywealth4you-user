import styles from './filterDropdown.module.scss';
import FilterIcon from '@/icons/filterIcon';

export default function FilterDropdown() {

    return (
        <div className={styles.filterdropdown}>
            <button>
                Filter
                <FilterIcon />
            </button>
        </div>
    );
}
