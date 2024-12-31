
function customGroupBy<TMODEL, TGROUP_MODEL>(list: Array<TMODEL>, keyFn: (item: TMODEL) => any, groupValueFn: (item: TMODEL) => TGROUP_MODEL): Array<{ main: TGROUP_MODEL, data: Array<TMODEL> }> {
  const aggrupation = list.reduce((acc: any, item: TMODEL) => {

    const key = keyFn(item);

    if (!acc[key]) {
      acc[key] = {
        main: groupValueFn(item),
        data: []
      };
    }

    acc[key].data.push(item);

    return acc;
  }, {});

  return Object.keys(aggrupation).map(obj => aggrupation[obj])
}

function getSubDomain() {
  const hostname = window.location.hostname;

  const domainParts = hostname.split('.');

  let subdomain = null;

  if (domainParts.length >= 2) {
    subdomain = domainParts[0];
  }

  return subdomain
}

export {
  customGroupBy,
  getSubDomain
}
