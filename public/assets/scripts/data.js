async function getDataCenters() {
    const dc = await getRequest(
        '/rest/vcenter/datacenter'
    );

    console.log(dc);
}