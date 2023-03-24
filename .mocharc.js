module.exports = {
    extension: ['ts'], // 该项目使用 typescript 来编写，只需要关注 ts
    spec: ['test/**/*.spec.ts'], // mocha 会将这些文件当作测试文件
    'watch-files': ['src/**/*.ts', 'lib/**/*.ts', 'test/**/*.ts'], // mocha 会在 watch 模式下检察这些文件，一时变量就会重新跑测试用例
    require: 'ts-node/register',
    timeout: 300, // 基本不存在耗时长用例，将超时时间调短有利于本地开发时快速响应错误的超时
}
