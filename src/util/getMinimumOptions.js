const getMinimumOptions = async (pageType, tabType) => {
  let minimumOptions;

  tabType = !tabType ? pageType : tabType;

  minimumOptions = {
    title: 'It\'s Lit',
    tabType: tabType,
    type: pageType
  }

  return minimumOptions;
};

module.exports = getMinimumOptions;