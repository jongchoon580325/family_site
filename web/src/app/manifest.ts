import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '우리가족 이야기',
        short_name: '우리가족',
        description: '가족의 역사와 추억을 간직하는 공간',
        start_url: '/',
        display: 'standalone',
        background_color: '#fffbeb',
        theme_color: '#fbbf24',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
