declare const items: ({
    title: string;
    url: string;
    children?: undefined;
} | {
    title: string;
    url: string;
    children: {
        title: string;
        url: string;
    }[];
})[];
export default items;
