import { CustomSlugs } from '../../../config/constants.js';
import { getAllSlugs } from '../../../utils/models.js';
import pluginId from "../../../utils/pluginId";
import { getService } from '../../../utils/utils.js';
import { handleAsyncError } from '../../content-api/utils.js';

const exportData = async (ctx) => {
  if (!(await hasPermissions(ctx))) {
    return ctx.forbidden();
  }
  let data;
  const { data: dataRaw } = ctx.request.body;
  const { slug, search, applySearch, exportFormat, relationsAsId, deepness = 5, exportPluginsContentTypes, locale } = dataRaw;
  data = await getService('export').exportData({ slug, search, applySearch, exportFormat, relationsAsId, deepness, locale });
  ctx.body = {
    data,
  };
};

const hasPermissions = async (ctx) => {
  const { data } = ctx.request.body;
  const { slug } = data
  const { userAbility } = ctx.state;

  const slugs = slug === CustomSlugs.WHOLE_DB ? getAllSlugs() : [slug];
  const config = await strapi.config.get(`plugin::${pluginId}`)
  const allowedSlugs = slugs.filter((slug) => {
    const permissionChecker = strapi.plugin('content-manager').service('permission-checker').create({ userAbility, model: slug });
    return permissionChecker.can.read() && config.authorizedExports.includes(slug);
  });
  return !!allowedSlugs.length;
};

export default ({ strapi }) => ({
  exportData: handleAsyncError(exportData),
});
