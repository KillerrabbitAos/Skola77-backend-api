const SequelizeMock = require("sequelize-mock");
const createOrganization = require("./createOrganization");

const DBConnectionMock = new SequelizeMock();

const mockOrganization = DBConnectionMock.define("Organization", {
    id: 1,
    name: "Test Organization",
    owner_id: 1,
    creator_id: 1,
});

const mockMembership = DBConnectionMock.define("Membership", {
    user_id: 1,
    organization_id: 1,
    permissions: "owner",
});

jest.mock("../../models", () => ({
    Organization: mockOrganization,
    Membership: mockMembership,
}));

describe("createOrganization", () => {
    beforeEach(() => {
        mockOrganization.$queryInterface.$clearResults();
        mockMembership.$queryInterface.$clearResults();
    });

    it("should create an organization and add the owner as a member", async () => {
        const userId = 1;
        const name = "Test Organization";
        const organizationId = 1;

        mockOrganization.$queueResult({
            id: organizationId,
        });

        const organization = await createOrganization(userId, name);

        expect(mockOrganization.create).toHaveBeenCalledWith({
            name,
            owner_id: userId,
            creator_id: userId,
        });

        expect(mockMembership.create).toHaveBeenCalledWith({
            user_id: userId,
            organization_id: organizationId,
            permissions: "owner",
        });

        expect(organization).toEqual({ id: organizationId });
    });

    it("should add additional members with edit permissions", async () => {
        const userId = 1;
        const name = "Test Organization";
        const memberIds = [2, 3];
        const organizationId = 1;

        mockOrganization.$queueResult({
            id: organizationId,
        });

        await createOrganization(userId, name, memberIds);

        expect(mockOrganization.create).toHaveBeenCalledWith({
            name,
            owner_id: userId,
            creator_id: userId,
        });

        expect(mockMembership.create).toHaveBeenCalledWith({
            user_id: userId,
            organization_id: organizationId,
            permissions: "owner",
        });

        memberIds.forEach((memberId) => {
            expect(mockMembership.create).toHaveBeenCalledWith({
                user_id: memberId,
                organization_id: organizationId,
                permissions: "edit",
            });
        });
    });

    it("should handle a single member ID as a non-array", async () => {
        const userId = 1;
        const name = "Test Organization";
        const memberId = 2;
        const organizationId = 1;

        mockOrganization.$queueResult({
            id: organizationId,
        });

        await createOrganization(userId, name, memberId);

        expect(mockOrganization.create).toHaveBeenCalledWith({
            name,
            owner_id: userId,
            creator_id: userId,
        });

        expect(mockMembership.create).toHaveBeenCalledWith({
            user_id: userId,
            organization_id: organizationId,
            permissions: "owner",
        });

        expect(mockMembership.create).toHaveBeenCalledWith({
            user_id: memberId,
            organization_id: organizationId,
            permissions: "edit",
        });
    });
});