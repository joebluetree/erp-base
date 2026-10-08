using iErp.ModuleTemplate.Todos;

namespace iErp.Tests.Unit;

public class TodoSaveRequestValidatorTests
{
    private readonly TodoSaveRequestValidator _validator = new();

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Empty_title_is_invalid(string title)
        => Assert.False(_validator.Validate(new TodoSaveRequest(null, title, null, false)).IsValid);

    [Fact]
    public void Title_over_200_chars_is_invalid()
        => Assert.False(_validator.Validate(new TodoSaveRequest(null, new string('a', 201), null, false)).IsValid);

    [Fact]
    public void Title_of_200_chars_is_valid()
        => Assert.True(_validator.Validate(new TodoSaveRequest(null, new string('a', 200), null, false)).IsValid);
}
