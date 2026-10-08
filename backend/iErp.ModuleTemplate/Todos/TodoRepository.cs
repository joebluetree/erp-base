using iErp.Data;
using iErp.Data.Repositories;
using iErp.Entities.Todos;

namespace iErp.ModuleTemplate.Todos;

public interface ITodoRepository : IRepository<TodoItem>;

public class TodoRepository(AppDbContext db) : Repository<TodoItem>(db), ITodoRepository;
