using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.ToTable("Conversations");

            builder.HasKey(c => c.Id);

            // One active conversation per recruiter-student pair
            builder.HasIndex(c => new { c.RecruiterId, c.StudentId })
                   .IsUnique();

            builder.Property(c => c.JobPositionTitle)
                   .HasMaxLength(100);

            builder.Property(c => c.CreatedAt)
                   .HasDefaultValueSql("GETUTCDATE()");

            builder.HasOne(c => c.Recruiter)
                   .WithMany(u => u.ConversationsAsRecruiter)
                   .HasForeignKey(c => c.RecruiterId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Student)
                   .WithMany(u => u.ConversationsAsStudent)
                   .HasForeignKey(c => c.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
