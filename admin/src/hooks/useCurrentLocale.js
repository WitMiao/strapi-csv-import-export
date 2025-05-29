import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to extract current locale from URL parameters
 * In Strapi 5, when working with i18n content, the locale is typically passed as a URL parameter
 * Example URLs:
 * - /admin/content-manager/collection-types/api::article.article?plugins[i18n][locale]=en
 * - /admin/content-manager/collection-types/api::article.article?plugins[i18n][locale]=zh-CN
 */
export const useCurrentLocale = () => {
    const { search } = useLocation();

    const currentLocale = useMemo(() => {
        try {
            const searchParams = new URLSearchParams(search);

            // Try to get locale from i18n plugin parameter
            const i18nLocale = searchParams.get('plugins[i18n][locale]');
            if (i18nLocale) {
                return i18nLocale;
            }

            // Try to get from direct locale parameter (fallback)
            const directLocale = searchParams.get('locale');
            if (directLocale) {
                return directLocale;
            }

            // If no locale found in URL, return null (will be handled as default)
            return null;
        } catch (error) {
            console.warn('Error parsing locale from URL:', error);
            return null;
        }
    }, [search]);

    return {
        currentLocale,
        hasLocale: currentLocale !== null,
    };
};