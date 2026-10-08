using iErp.Data;

namespace iErp.Tests.Unit;

public class Oracle10gCompatibilityInterceptorTests
{
    [Fact]
    public void Fetch_first_is_rewritten_to_rownum()
    {
        var sql = Oracle10gCompatibilityInterceptor.Rewrite("SELECT \"t\".\"ID\"\r\nFROM \"T\" \"t\"\r\nWHERE \"t\".\"ID\" = :p_0\r\nFETCH FIRST 1 ROWS ONLY");

        Assert.Equal("SELECT * FROM (\nSELECT \"t\".\"ID\"\nFROM \"T\" \"t\"\nWHERE \"t\".\"ID\" = :p_0\n) WHERE ROWNUM <= 1", sql);
    }

    [Fact]
    public void Carriage_returns_are_removed()
        => Assert.DoesNotContain('\r', Oracle10gCompatibilityInterceptor.Rewrite("DECLARE\r\nBEGIN\r\nNULL;\r\nEND;"));

    [Fact]
    public void Plain_select_is_unchanged()
        => Assert.Equal("SELECT 1 FROM DUAL", Oracle10gCompatibilityInterceptor.Rewrite("SELECT 1 FROM DUAL"));
}
