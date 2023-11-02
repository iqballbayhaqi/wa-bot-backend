const TicketService = require('../services/ticket.service');
const DepartmentService = require('../services/department.service');
const CategoryService = require('../services/category.service');

const Joi = require('joi');
const validate = require('../middlewares/validate-request');
const httpResponse = require('../helpers/httpResponse');

const TicketController = {
    getAllTickets: async (req, res) => {
        try {
            const Tickets = await TicketService.getAllTickets();

            return httpResponse.success(res, Tickets);
        } catch (err) {
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    getTicketById: async (req, res) => {
        try {
            const { id } = req.params;

            const ticket = await TicketService.getTicketById(id);

            if (!ticket) {
                return httpResponse.notfound(res, "Ticket not found");
            }

            return httpResponse.success(res, ticket);
        } catch (err) {
            return httpResponse.error(res, "Internal Server Error");
        }
    },

    moveTicket: async (req, res) => {
        try {
            const { id, departmentId, categoryId } = req.body;
            const lastModifiedBy = req.user.id;

            const ticketData = { id, departmentId, categoryId };
            await validate(moveTicketSchema, ticketData);

            const ticket = await TicketService.getTicketById(id);

            if (!ticket) {
                return httpResponse.notfound(res, "Ticket not found");
            }

            const department = await DepartmentService.getDepartmentById(departmentId);
            if (!department) {
                return httpResponse.notfound(res, "Department not found");
            }

            if (categoryId) {
                const category = await CategoryService.getCategoryById(categoryId);
                if (!category) {
                    return httpResponse.notfound(res, "Category not found");
                }
            }

            const result = await TicketService.moveTicket(id, departmentId, categoryId, lastModifiedBy);

            return httpResponse.success(res, result);
        } catch (err) {
            if (err.isJoi) {
                return httpResponse.badrequest(res, err.message);
            }
            if (err.statusCode === 404) {
                return httpResponse.notfound(res, err.message);
            }
            return httpResponse.error(res, "Internal Server Error");
        }
    }
};

const moveTicketSchema = Joi.object({
    id: Joi.number().required(),
    departmentId: Joi.number().required(),
    categoryId: Joi.number()
});

module.exports = TicketController;
