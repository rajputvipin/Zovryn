const { execSync } = require('child_process');
try {
    console.log('Running prisma db push...');
    const out1 = execSync('npx prisma db push', { encoding: 'utf8' });
    console.log('Push stdout:\n', out1);

    console.log('Running prisma generate...');
    const out2 = execSync('npx prisma generate', { encoding: 'utf8' });
    console.log('Generate stdout:\n', out2);
} catch (e) {
    console.log('FAILED!');
    console.log('STDOUT:\n', e.stdout);
    console.error('STDERR:\n', e.stderr);
    process.exit(1);
}
