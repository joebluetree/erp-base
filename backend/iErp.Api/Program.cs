using iErp.Api.Middleware;
using iErp.Data;
using iErp.ModuleTemplate;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, logger) => logger
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext());

builder.Services.AddData(builder.Configuration);
builder.Services.AddModuleTemplate();

builder.Services.AddControllers(o => o.Filters.Add<ValidationFilter>())
    .AddApplicationPart(typeof(ModuleTemplateRegistration).Assembly);
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseExceptionHandler();
app.UseSerilogRequestLogging();

if (!app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();

public partial class Program;
