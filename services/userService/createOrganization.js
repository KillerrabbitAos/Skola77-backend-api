const { Organization, Membership } = require('../../models');

async function createOrganization(userId, name, memberIds = []) {
  const organization = await Organization.create({
    name,
    owner_id: userId,
    creator_id: userId,
  });

  await Membership.create({
    user_id: userId,
    organization_id: organization.id,
    permissions: 'owner',
  });

  if (!Array.isArray(memberIds)) {
    memberIds = [memberIds];
  }

  for (const memberId of memberIds) {
    await Membership.create({
      user_id: memberId,
      organization_id: organization.id,
      permissions: 'edit',
    });
  }

  return organization;
}

module.exports = {
  createOrganization,
};