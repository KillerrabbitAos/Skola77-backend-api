const { User, Room, SeatingPlan, Group } = require("../../models");
const createEntity = require("./createEntity");

jest.mock("../../models");

describe("createEntity", () => {
    let userMock;

    beforeEach(() => {
        userMock = {
            addRoom: jest.fn(),
            addSeatingPlan: jest.fn(),
            addGroup: jest.fn(),
        };
        User.findByPk.mockResolvedValue(userMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a room and associate it with the user", async () => {
        const roomMock = { id: 1, name: "Room 1", jsData: {}, ownerId: 1 };
        Room.create.mockResolvedValue(roomMock);

        const result = await createEntity(1, "room", "Room 1", {});

        expect(Room.create).toHaveBeenCalledWith({ name: "Room 1", jsData: {}, ownerId: 1 });
        expect(userMock.addRoom).toHaveBeenCalledWith(roomMock);
        expect(result).toEqual({ entity: roomMock, entityName: "room" });
    });

    it("should create a seating plan and associate it with the user", async () => {
        const seatingPlanMock = { id: 1, name: "Seating Plan 1", jsData: {}, ownerId: 1 };
        SeatingPlan.create.mockResolvedValue(seatingPlanMock);

        const result = await createEntity(1, "seatingplan", "Seating Plan 1", {});

        expect(SeatingPlan.create).toHaveBeenCalledWith({ name: "Seating Plan 1", jsData: {}, ownerId: 1 });
        expect(userMock.addSeatingPlan).toHaveBeenCalledWith(seatingPlanMock);
        expect(result).toEqual({ entity: seatingPlanMock, entityName: "seatingplan" });
    });

    it("should create a group and associate it with the user", async () => {
        const groupMock = { id: 1, name: "Group 1", jsData: {}, ownerId: 1 };
        Group.create.mockResolvedValue(groupMock);

        const result = await createEntity(1, "group", "Group 1", {});

        expect(Group.create).toHaveBeenCalledWith({ name: "Group 1", jsData: {}, ownerId: 1 });
        expect(userMock.addGroup).toHaveBeenCalledWith(groupMock);
        expect(result).toEqual({ entity: groupMock, entityName: "group" });
    });

    it("should throw an error for an invalid type", async () => {
        await expect(createEntity(1, "invalidType", "Invalid", {})).rejects.toThrow("Invalid type");
    });
});