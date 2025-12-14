type AppConfig = {
  App: string;
  Version: string;
  Subtitle: string;
  Mobile: string;
  Telephone: string;
  Email: string;
  Footer: string;
};

const AppConfig: AppConfig = {
  App: 'EduSync',
  Version: 'v1.0.0',
  Subtitle: 'Learning Management System',
  Mobile: '09455477865',
  Telephone: '(02) 8123-4567',
  get Email() {
    const name = this.App.toLowerCase().replace(/ /g, '');
    return `info@${name}.com`;
  },
  get Footer() {
    return `${this.App} Platform`;
  },
};

export default AppConfig;
