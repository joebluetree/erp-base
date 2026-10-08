using FluentValidation;
using iErp.Data.Configurations;

namespace iErp.ModuleTemplate.Todos;

public class TodoSaveRequestValidator : AbstractValidator<TodoSaveRequest>
{
    public TodoSaveRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(TodoItemConfiguration.TitleMaxLength);
        RuleFor(x => x.Description).MaximumLength(2000);
    }
}
