const sql = require('mssql');
const config = require('../../config/db.config')

const DepartmentModel = {
	getAllDepartments: async () => {
		try {
			await sql.connect(config);
			const result = await sql.query('SELECT * FROM Department WHERE modifyStatus != \'D\'');
			const departments = result.recordset.map((row) => ({
				id: row.id,
				name: row.name,
				code: row.code,
				modifyStatus: row.modifyStatus,
				createdTime: row.createdTime,
				createdBy: row.createdBy,
				lastModifiedTime: row.lastModifiedTime,
				lastModifiedBy: row.lastModifiedBy,
			}));
			return departments;
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			sql.close();
		}
	},

	addDepartment: async (departmentData) => {
		try {
			await sql.connect(config);

			const request = new sql.Request();

			request.input('name', sql.VarChar, departmentData.name);
			request.input('code', sql.VarChar, departmentData.code);
			request.input('createdBy', sql.Int, departmentData.createdBy);

			const result = await request.query(`
				INSERT INTO Department (name, code, createdBy)
				VALUES (@name, @code, @createdBy);
				SELECT SCOPE_IDENTITY() AS newDepartmentId;
			`);

			return result.recordset[0].newDepartmentId;
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			sql.close();
		}
	},

	//use parameterized query to prevent sql injection
	updateDepartment: async (departmentData) => {
		try {
			await sql.connect(config);

			const request = new sql.Request();

			request.input('name', sql.VarChar, departmentData.name);
			request.input('code', sql.VarChar, departmentData.code);
			request.input('id', sql.Int, departmentData.id);
			request.input('modifyStatus', sql.VarChar, 'U')
			request.input('lastModifiedBy', sql.Int, departmentData.lastModifiedBy);

			const result = await request.query(`
				UPDATE Department
				SET name = @name,
					code = @code,
					modifyStatus = @modifyStatus,
					lastModifiedBy = @lastModifiedBy
				WHERE id = @id
			`);

			return result;
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			sql.close();
		}
	},

	deleteDepartment: async (departmentData) => {
		try {
			await sql.connect(config);

			const request = new sql.Request();

			request.input('id', sql.Int, departmentData.id);
			request.input('modifyStatus', sql.VarChar, 'D');
			request.input('lastModifiedBy', sql.Int, departmentData.lastModifiedBy);

			const result = await request.query(`
				UPDATE Department
				SET modifyStatus = @modifyStatus,
					lastModifiedBy = @lastModifiedBy
				WHERE id = @id
			`);

			return result;
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			sql.close();
		}
	},

	getDepartmentByCode: async (departmentCode) => {
		try {
			await sql.connect(config);

			const request = new sql.Request();

			request.input('code', sql.VarChar, departmentCode);

			const result = await request.query(`
				SELECT * FROM Department
				WHERE code = @code
				AND modifyStatus != 'D'
			`);

			return result.recordset[0];
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			sql.close();
		}
	},

	getDepartmentById: async (departmentId) => {
		try {
			await sql.connect(config);

			const request = new sql.Request();

			request.input('id', sql.Int, departmentId);

			const result = await request.query(`
				SELECT * FROM Department
				WHERE id = @id
			`);

			return result.recordset[0];
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			sql.close();
		}
	},

};

module.exports = DepartmentModel;
