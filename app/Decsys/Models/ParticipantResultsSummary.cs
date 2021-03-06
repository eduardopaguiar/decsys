using System.Collections.Generic;

namespace Decsys.Models
{
    /// <summary>
    /// An export model for a participant's response data in a survey instance.
    /// </summary>
    public class ParticipantResultsSummary
    {
        public ParticipantResultsSummary(string id) => Id = id;

        public string Id { get; set; }

        /// <summary>
        /// The participant's reponse to each survey question
        /// </summary>
        public List<PageResponseSummary> Responses { get; set; } = new List<PageResponseSummary>();
    }
}
