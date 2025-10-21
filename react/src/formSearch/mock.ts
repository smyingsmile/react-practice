// 模拟 10,000 条用户数据
export const mockUsers = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
  email: `user${index + 1}@example.com`,
  address: `地址 ${index + 1}, 城市 ${index % 100}`,
  phone: `+86 ${Math.random().toString().slice(2, 11)}`,
  company: `公司 ${index % 50}`,
  avatar: `https://i.pravatar.cc/150?img=${index % 70}`,
  description: `这是用户 ${index + 1} 的详细描述信息，用于测试虚拟滚动性能。`.repeat(Math.ceil(Math.random() * 3))
}));


export const getUsers = (page = 1, pageSize = 100) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: mockUsers.slice(start, end),
    total: mockUsers.length,
    page,
    pageSize,
    hasMore: end < mockUsers.length
  };
};
