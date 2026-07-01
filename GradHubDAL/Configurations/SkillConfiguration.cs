using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class SkillConfiguration : IEntityTypeConfiguration<Skill>
    {
        public void Configure(EntityTypeBuilder<Skill> builder)
        {
            builder.ToTable("Skills");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            // Case-insensitive uniqueness is enforced at the BLL layer;
            // the DB index enforces binary uniqueness as a safety net.
            builder.HasIndex(s => s.Name)
                   .IsUnique();
        }
    }
}
