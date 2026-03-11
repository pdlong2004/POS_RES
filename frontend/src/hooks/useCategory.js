import { useEffect } from 'react';
import { useState } from 'react';
import { getCategoryApi } from '../service/category.service';

export const useCategory = () => {
    const [categories, setCategories] = useState();

    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await getCategoryApi();
                setCategories(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        getCategory();
    }, []);

    return { categories };
};
