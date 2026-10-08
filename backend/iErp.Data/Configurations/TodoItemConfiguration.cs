using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iErp.Entities.Todos;

namespace iErp.Data.Configurations;

public class TodoItemConfiguration : IEntityTypeConfiguration<TodoItem>
{
    public const int TitleMaxLength = 200;

    public void Configure(EntityTypeBuilder<TodoItem> builder)
    {
        builder.ToTable("TODO_ITEMS");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("ID").HasColumnType("RAW(16)").ValueGeneratedNever();
        builder.Property(x => x.Title).HasColumnName("TITLE").HasMaxLength(TitleMaxLength).IsRequired();
        builder.Property(x => x.Description).HasColumnName("DESCRIPTION").HasMaxLength(2000);
        builder.Property(x => x.IsCompleted).HasColumnName("IS_COMPLETED").HasColumnType("NUMBER(1)").IsRequired();
    }
}
