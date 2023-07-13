import {
  createServer,
  RestSerializer,
  Model,
  belongsTo,
  hasMany,
} from 'miragejs';
import Cookies from 'js-cookie';

export default function () {
  createServer({
    serializers: {
      application: RestSerializer,
      permission: RestSerializer.extend({
        include: ['application'],
        embed: true,
      }),
    },
    models: {
      organization: Model,
      application: Model.extend({
        organization: belongsTo(),
      }),
      permission: Model.extend({
        application: belongsTo(),
      }),
      role: Model.extend({
        organization: belongsTo(),
        permissions: hasMany('permission'),
      }),
    },

    seeds(server) {
      const artsOrg = server.create('organization', {
        name: 'Arts',
        roles: 4,
        applications: 2,
        users: 30,
      });
      server.create('organization', {
        name: 'Classics',
        roles: 5,
        applications: 1,
        users: 35,
      });
      server.create('organization', {
        name: 'Commerce',
        roles: 7,
        applications: 4,
        users: 30,
      });
      server.create('organization', {
        name: 'Economics',
        roles: 10,
        applications: 5,
        users: 55,
      });
      server.create('organization', {
        name: 'Engineering',
        roles: 7,
        applications: 3,
        users: 33,
      });
      server.create('organization', {
        name: 'Law',
        roles: 8,
        applications: 5,
        users: 55,
      });

      const prtfApp = server.create('application', {
        name: 'Portfolio Manager',
        key: '4tx18BAvTqeqtxbLFsE3JoT8I1NIvBPy',
        permissions: 8,
        organization: artsOrg,
      });
      const refApp = server.create('application', {
        name: 'Reference Browser',
        key: 'ViAB80v1KVSPmvyfEg857hesRst1IMHl',
        permissions: 0,
        organization: artsOrg,
      });

      const cr = server.create('permission', {
        name: 'Create result',
        value: 'result_create',
        application: prtfApp,
      });
      const rr = server.create('permission', {
        name: 'Read result',
        value: 'result_read',
        application: prtfApp,
      });
      const ur = server.create('permission', {
        name: 'Update result',
        value: 'result_update',
        application: prtfApp,
      });
      const dr = server.create('permission', {
        name: 'Delete result',
        value: 'result_delete',
        application: prtfApp,
      });
      const agp = server.create('permission', {
        name: 'Access global portfolios',
        value: 'portfolio_gb_access',
        application: prtfApp,
      });
      const mes = server.create('permission', {
        name: 'Make entry suggestions',
        value: 'suggestions_create',
        application: prtfApp,
      });
      const cref = server.create('permission', {
        name: 'Create reference',
        value: 'reference_create',
        application: refApp,
      });
      const rref = server.create('permission', {
        name: 'Read reference',
        value: 'reference_read',
        application: refApp,
      });
      const uref = server.create('permission', {
        name: 'Update reference',
        value: 'reference_update',
        application: refApp,
      });
      const dref = server.create('permission', {
        name: 'Delete reference',
        value: 'reference_delete',
        application: refApp,
      });

      server.create('role', {
        name: 'Teacher',
        organization: artsOrg,
        permissions: [rr, rref],
      });
      server.create('role', {
        name: 'Manager',
        organization: artsOrg,
        permissions: [cr, rr, ur, rref, cref],
      });
    },

    routes() {
      this.namespace = 'api';
      this.timing = 50;

      this.post('/auth', (schema, request) => {
        const creds = JSON.parse(request.requestBody);
        Cookies.set('token', creds.response.credential, { expires: 1 });
      });

      // Organization
      this.get('/organization');
      this.get('/organization/:id');
      this.post('/organization');
      this.patch('/organization/:id');

      // Application
      this.get('/organization/:id/application', (schema, request) => {
        const organizationId = request.params.id;
        return schema.applications.where({ organizationId });
      });
      this.get('/application/:id');
      this.post('/organization/:id/application/', (schema, request) => {
        const attr = JSON.parse(request.requestBody);
        const organizationId = request.params.id;
        attr.organizationId = organizationId;
        attr.permissions - 0;
        return schema.applications.create(attr);
      });
      this.patch('/application/:id', (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;
        let application = schema.applications.find(id);
        return application.update(newAttrs);
      });

      // Permission
      this.get('/application/:id/permission', (schema, request) => {
        const appId = request.params.id;
        return schema.permissions.where({ applicationId: appId });
      });
      this.post('/application/:id/permission', (schema, request) => {
        const appId = request.params.id;
        const attr = JSON.parse(request.requestBody);
        attr.applicationId = appId;
        return schema.permissions.create(attr);
      });
      this.patch('/permission/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const id = request.params.id;
        const permission = schema.permissions.find(id);
        return permission.update(newAttrs);
      });
      this.get('/permission', (schema, request) => {
        const permissions = schema.permissions.all();
        return schema.permissions.all();
      });

      // Role
      this.get('/organization/:id/role', (schema, request) => {
        const organizationId = request.params.id;
        return schema.roles.where({ organizationId });
      });
    },
  });
}
