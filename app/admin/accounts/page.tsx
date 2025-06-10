const AccountManagement: React.FC = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quản lý tài khoản</h2>
                <p className="text-gray-600">Quản lý tài khoản người dùng và phân quyền</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                    <span className="text-2xl mr-3">🚧</span>
                    <div>
                        <p className="font-medium">Tính năng đang phát triển</p>
                        <p className="text-sm">Quản lý tài khoản sẽ được hoàn thiện trong phiên bản tiếp theo.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;
