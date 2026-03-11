import { useState, useEffect } from 'react';
import { getTablesApi } from '../service/table.service.js';

export const useTable = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTables = async () => {
            try {
                const res = await getTablesApi();
                setTables(res?.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getTables();
    }, []);

    return { tables, loading };
};
