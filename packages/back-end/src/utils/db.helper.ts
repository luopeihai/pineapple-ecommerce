import { SelectQueryBuilder } from 'typeorm';

export const conditionUtils = (
  queryBuilder: any,
  obj: any
) => {
  // 后面的.where会替换前面的.where
  // WHERE 1=1 AND ...
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: obj[key] });
    }
  });
  return queryBuilder;
};
