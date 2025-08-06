import { GetServerSideProps } from 'next';

export default function GuildIndexRedirect() {
    return null; // This page will redirect before rendering
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { guild } = ctx.query;
    
    return {
        redirect: {
            destination: `/dashboard/guilds/${guild}/home`,
            permanent: true,
        }
    };
};
